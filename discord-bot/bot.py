import discord
from discord.ext import commands
from discord import app_commands
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
import asyncio

# Load environment variables
load_dotenv()

# Configure logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),  # Log to file
        logging.StreamHandler()  # Also log to console
    ]
)
logger = logging.getLogger('discord_bot')

# Bot configuration
DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
PREMIUM_ROLE_NAME = os.getenv('PREMIUM_ROLE_NAME', 'Premium')
ADMIN_ROLE_NAME = os.getenv('ADMIN_ROLE_NAME', 'Admin')

# Security: Rate limiting (command usage tracking)
COMMAND_COOLDOWN = 5  # seconds between commands per user
user_cooldowns = {}

# Bot setup with restricted intents
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

def check_rate_limit(user_id):
    """Check if user is rate limited"""
    now = datetime.now()
    if user_id in user_cooldowns:
        last_command = user_cooldowns[user_id]
        if (now - last_command).total_seconds() < COMMAND_COOLDOWN:
            return False
    user_cooldowns[user_id] = now
    return True

def sanitize_user_input(text, max_length=1000):
    """Sanitize user input to prevent injection attacks"""
    if not isinstance(text, str):
        return ""
    return text[:max_length].replace('`', '\\`')

@bot.event
async def on_ready():
    """Called when bot successfully connects to Discord"""
    logger.info(f'✅ Bot logged in as {bot.user.name} (ID: {bot.user.id})')
    logger.info(f'🔧 Premium role: {PREMIUM_ROLE_NAME}')
    logger.info(f'🔧 Admin role: {ADMIN_ROLE_NAME}')
    
    # Sync slash commands
    try:
        synced = await bot.tree.sync()
        logger.info(f'✅ Synced {len(synced)} slash command(s)')
    except Exception as e:
        logger.error(f'❌ Failed to sync commands: {e}')

@bot.tree.command(name="verify", description="Verify a user's payment and assign premium role")
@app_commands.describe(
    user_id="Discord User ID from payment notes",
    payment_amount="Amount paid (for verification)",
    payment_reference="Payment ID or reference (optional)"
)
async def verify_payment(
    interaction: discord.Interaction,
    user_id: str,
    payment_amount: str,
    payment_reference: str = "N/A"
):
    """
    Slash command to verify payment and assign premium role
    Security: Only admins can use this command
    Usage: /verify <user_id> <payment_amount> [payment_reference]
    """
    
    # Check rate limiting
    if not check_rate_limit(interaction.user.id):
        await interaction.response.send_message(
            "⏱️ Please wait a moment before using this command again.",
            ephemeral=True
        )
        return
    
    # Check if user has admin permissions
    admin_role = discord.utils.get(interaction.guild.roles, name=ADMIN_ROLE_NAME)
    
    if not (interaction.user.guild_permissions.administrator or 
            (admin_role and admin_role in interaction.user.roles)):
        logger.warning(f'⚠️ Unauthorized verify attempt by {interaction.user.name} (ID: {interaction.user.id})')
        await interaction.response.send_message(
            "❌ You don't have permission to use this command.",
            ephemeral=True
        )
        return
    
    # Defer response since we might take a moment
    await interaction.response.defer(ephemeral=True)
    
    try:
        # Validate and convert user_id to integer
        try:
            user_id_int = int(user_id.strip())
        except (ValueError, AttributeError):
            await interaction.followup.send(
                f"❌ Invalid User ID format. User ID must be a number.\n"
                f"You provided: `{sanitize_user_input(user_id)}`",
                ephemeral=True
            )
            return
        
        # Validate payment_amount format (basic check)
        if not payment_amount or not payment_amount.strip():
            await interaction.followup.send(
                "❌ Payment amount cannot be empty.",
                ephemeral=True
            )
            return
        
        # Find the user in the guild
        member = interaction.guild.get_member(user_id_int)
        
        if not member:
            logger.info(f'User {user_id_int} not found in guild during verify attempt')
            await interaction.followup.send(
                f"❌ User with ID `{user_id_int}` not found in this server.\n"
                f"**Possible reasons:**\n"
                f"• User hasn't joined the Discord server yet\n"
                f"• User ID is incorrect\n"
                f"• User has left the server",
                ephemeral=True
            )
            return
        
        # Get or create the premium role
        premium_role = discord.utils.get(interaction.guild.roles, name=PREMIUM_ROLE_NAME)
        
        if not premium_role:
            # Create the role if it doesn't exist
            try:
                premium_role = await interaction.guild.create_role(
                    name=PREMIUM_ROLE_NAME,
                    color=discord.Color.from_rgb(0, 255, 163),  # Neon green
                    hoist=True,  # Display separately in member list
                    mentionable=True,
                    reason="Premium role created by verification bot"
                )
                logger.info(f'✅ Created premium role: {PREMIUM_ROLE_NAME}')
            except discord.Forbidden:
                logger.error('Bot lacks permissions to create roles')
                await interaction.followup.send(
                    "❌ I don't have permission to create roles.\n"
                    "Please create the role manually in Server Settings → Roles.",
                    ephemeral=True
                )
                return
        
        # Check if user already has the role
        if premium_role in member.roles:
            await interaction.followup.send(
                f"⚠️ {member.mention} already has the **{PREMIUM_ROLE_NAME}** role.",
                ephemeral=True
            )
            return
        
        # Assign the premium role
        try:
            await member.add_roles(premium_role, reason=f"Payment verified by {interaction.user.name}")
        except discord.Forbidden:
            logger.error(f'Bot lacks permissions to assign roles to {member.name}')
            await interaction.followup.send(
                f"❌ I don't have permission to assign roles.\n"
                f"Please ensure the bot role is above the **{PREMIUM_ROLE_NAME}** role in Server Settings → Roles.",
                ephemeral=True
            )
            return
        
        # Sanitize payment details for logging
        safe_amount = sanitize_user_input(payment_amount)
        safe_reference = sanitize_user_input(payment_reference)
        
        # Send confirmation to admin
        await interaction.followup.send(
            f"✅ **Payment Verified!**\n\n"
            f"**User:** {member.mention} (`{member.name}`)\n"
            f"**User ID:** `{user_id_int}`\n"
            f"**Amount:** {safe_amount}\n"
            f"**Reference:** {safe_reference}\n"
            f"**Role Assigned:** {premium_role.mention}\n"
            f"**Verified by:** {interaction.user.mention}",
            ephemeral=True
        )
        
        # Try to DM the user
        try:
            embed = discord.Embed(
                title="🎉 Premium Access Granted!",
                description=f"Your payment has been verified and you now have access to **HackShala Premium**!",
                color=discord.Color.from_rgb(0, 255, 163)
            )
            embed.add_field(name="Amount Paid", value=safe_amount, inline=True)
            embed.add_field(name="Role Assigned", value=premium_role.name, inline=True)
            embed.set_footer(text="Thank you for joining HackShala Premium! 🔒")
            
            await member.send(embed=embed)
            logger.info(f'✅ Sent confirmation DM to {member.name}')
        except discord.Forbidden:
            logger.warning(f'⚠️ Could not send DM to {member.name} (DMs disabled)')
        
        # Log to a verification channel if it exists
        verification_log_channel = discord.utils.get(interaction.guild.text_channels, name='verification-logs')
        if verification_log_channel:
            try:
                log_embed = discord.Embed(
                    title="✅ Payment Verified",
                    color=discord.Color.green(),
                    timestamp=interaction.created_at
                )
                log_embed.add_field(name="User", value=f"{member.mention} (`{member.id}`)", inline=False)
                log_embed.add_field(name="Amount", value=safe_amount, inline=True)
                log_embed.add_field(name="Reference", value=safe_reference, inline=True)
                log_embed.add_field(name="Verified By", value=interaction.user.mention, inline=True)
                
                await verification_log_channel.send(embed=log_embed)
            except discord.Forbidden:
                logger.warning(f'Could not write to verification-logs channel')
        
        logger.info(f'✅ Assigned {PREMIUM_ROLE_NAME} role to {member.name} (ID: {user_id_int}) by {interaction.user.name}')
    
    except Exception as e:
        logger.error(f'❌ Error in verify command: {e}', exc_info=True)
        await interaction.followup.send(
            f"❌ An error occurred while processing your request.\n"
            f"Please check the bot permissions and try again.",
            ephemeral=True
        )

@bot.tree.command(name="remove-premium", description="Remove premium role from a user")
@app_commands.describe(user_id="Discord User ID to remove premium from")
async def remove_premium(interaction: discord.Interaction, user_id: str):
    """
    Slash command to remove premium role (for refunds, etc.)
    Security: Only admins can use this command
    Usage: /remove-premium <user_id>
    """
    
    # Check rate limiting
    if not check_rate_limit(interaction.user.id):
        await interaction.response.send_message(
            "⏱️ Please wait a moment before using this command again.",
            ephemeral=True
        )
        return
    
    # Check if user has admin permissions
    admin_role = discord.utils.get(interaction.guild.roles, name=ADMIN_ROLE_NAME)
    
    if not (interaction.user.guild_permissions.administrator or 
            (admin_role and admin_role in interaction.user.roles)):
        logger.warning(f'⚠️ Unauthorized remove-premium attempt by {interaction.user.name} (ID: {interaction.user.id})')
        await interaction.response.send_message(
            "❌ You don't have permission to use this command.",
            ephemeral=True
        )
        return
    
    await interaction.response.defer(ephemeral=True)
    
    try:
        try:
            user_id_int = int(user_id.strip())
        except (ValueError, AttributeError):
            await interaction.followup.send(
                f"❌ Invalid User ID format. User ID must be a number.",
                ephemeral=True
            )
            return
        
        member = interaction.guild.get_member(user_id_int)
        
        if not member:
            logger.info(f'User {user_id_int} not found in guild during remove-premium attempt')
            await interaction.followup.send(
                f"❌ User with ID `{user_id_int}` not found in this server.",
                ephemeral=True
            )
            return
        
        premium_role = discord.utils.get(interaction.guild.roles, name=PREMIUM_ROLE_NAME)
        
        if not premium_role or premium_role not in member.roles:
            await interaction.followup.send(
                f"⚠️ {member.mention} doesn't have the **{PREMIUM_ROLE_NAME}** role.",
                ephemeral=True
            )
            return
        
        try:
            await member.remove_roles(premium_role, reason=f"Removed by {interaction.user.name}")
        except discord.Forbidden:
            logger.error(f'Bot lacks permissions to remove roles from {member.name}')
            await interaction.followup.send(
                "❌ I don't have permission to remove roles.",
                ephemeral=True
            )
            return
        
        await interaction.followup.send(
            f"✅ Removed **{PREMIUM_ROLE_NAME}** role from {member.mention}",
            ephemeral=True
        )
        
        logger.info(f'✅ Removed {PREMIUM_ROLE_NAME} role from {member.name} (ID: {user_id_int}) by {interaction.user.name}')
    
    except Exception as e:
        logger.error(f'❌ Error in remove-premium command: {e}', exc_info=True)
        await interaction.followup.send(
            "❌ An error occurred while processing your request.",
            ephemeral=True
        )

@bot.command(name='ping')
async def ping(ctx):
    """Simple ping command to test bot responsiveness"""
    await ctx.send(f'🏓 Pong! Latency: {round(bot.latency * 1000)}ms')

# Error handler
@bot.event
async def on_command_error(ctx, error):
    """Handle command errors"""
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ You don't have permission to use this command.")
        logger.warning(f'Permission denied for {ctx.author.name}')
    elif isinstance(error, commands.CommandNotFound):
        pass  # Ignore unknown commands
    else:
        logger.error(f'Command error: {error}', exc_info=True)

# Run the bot
if __name__ == "__main__":
    if not DISCORD_TOKEN:
        logger.error("❌ DISCORD_TOKEN not found in .env file!")
        exit(1)
    
    try:
        logger.info("🚀 Starting Hackshala Discord Bot...")
        bot.run(DISCORD_TOKEN)
    except Exception as e:
        logger.error(f"❌ Failed to start bot: {e}", exc_info=True)
            )
            logger.info(f'✅ Created premium role: {PREMIUM_ROLE_NAME}')
        
        # Check if user already has the role
        if premium_role in member.roles:
            await interaction.followup.send(
                f"⚠️ {member.mention} already has the **{PREMIUM_ROLE_NAME}** role.",
                ephemeral=True
            )
            return
        
        # Assign the premium role
        await member.add_roles(premium_role, reason=f"Payment verified by {interaction.user.name}")
        
        # Send confirmation to admin
        await interaction.followup.send(
            f"✅ **Payment Verified!**\n\n"
            f"**User:** {member.mention} (`{member.name}`)\n"
            f"**User ID:** `{user_id}`\n"
            f"**Amount:** {payment_amount}\n"
            f"**Reference:** {payment_reference}\n"
            f"**Role Assigned:** {premium_role.mention}\n"
            f"**Verified by:** {interaction.user.mention}",
            ephemeral=True
        )
        
        # Try to DM the user
        try:
            embed = discord.Embed(
                title="🎉 Premium Access Granted!",
                description=f"Your payment has been verified and you now have access to **HackShala Premium**!",
                color=discord.Color.from_rgb(0, 255, 163)
            )
            embed.add_field(name="Amount Paid", value=payment_amount, inline=True)
            embed.add_field(name="Role Assigned", value=premium_role.name, inline=True)
            embed.set_footer(text="Thank you for joining HackShala Premium! 🔒")
            
            await member.send(embed=embed)
            logger.info(f'✅ Sent confirmation DM to {member.name}')
        except discord.Forbidden:
            logger.warning(f'⚠️ Could not send DM to {member.name} (DMs disabled)')
        
        # Log to a verification channel if it exists
        verification_log_channel = discord.utils.get(interaction.guild.text_channels, name='verification-logs')
        if verification_log_channel:
            log_embed = discord.Embed(
                title="✅ Payment Verified",
                color=discord.Color.green(),
                timestamp=interaction.created_at
            )
            log_embed.add_field(name="User", value=f"{member.mention} (`{member.id}`)", inline=False)
            log_embed.add_field(name="Amount", value=payment_amount, inline=True)
            log_embed.add_field(name="Reference", value=payment_reference, inline=True)
            log_embed.add_field(name="Verified By", value=interaction.user.mention, inline=True)
            
            await verification_log_channel.send(embed=log_embed)
        
        logger.info(f'✅ Assigned {PREMIUM_ROLE_NAME} role to {member.name} (ID: {user_id})')
    
    except ValueError:
        await interaction.followup.send(
            f"❌ Invalid User ID format. User ID must be a number.\n"
            f"You provided: `{user_id}`",
            ephemeral=True
        )
    
    except discord.Forbidden:
        await interaction.followup.send(
            f"❌ I don't have permission to assign roles.\n"
            f"Please ensure the bot role is above the **{PREMIUM_ROLE_NAME}** role in Server Settings → Roles.",
            ephemeral=True
        )
    
    except Exception as e:
        logger.error(f'❌ Error in verify command: {e}')
        await interaction.followup.send(
            f"❌ An error occurred: `{str(e)}`\n"
            f"Please check the bot permissions and try again.",
            ephemeral=True
        )

@bot.tree.command(name="remove-premium", description="Remove premium role from a user")
@app_commands.describe(user_id="Discord User ID to remove premium from")
async def remove_premium(interaction: discord.Interaction, user_id: str):
    """
    Slash command to remove premium role (for refunds, etc.)
    Usage: /remove-premium <user_id>
    """
    
    # Check if user has admin permissions
    admin_role = discord.utils.get(interaction.guild.roles, name=ADMIN_ROLE_NAME)
    
    if not (interaction.user.guild_permissions.administrator or 
            (admin_role and admin_role in interaction.user.roles)):
        await interaction.response.send_message(
            "❌ You don't have permission to use this command.",
            ephemeral=True
        )
        return
    
    await interaction.response.defer(ephemeral=True)
    
    try:
        user_id_int = int(user_id)
        member = interaction.guild.get_member(user_id_int)
        
        if not member:
            await interaction.followup.send(
                f"❌ User with ID `{user_id}` not found in this server.",
                ephemeral=True
            )
            return
        
        premium_role = discord.utils.get(interaction.guild.roles, name=PREMIUM_ROLE_NAME)
        
        if not premium_role or premium_role not in member.roles:
            await interaction.followup.send(
                f"⚠️ {member.mention} doesn't have the **{PREMIUM_ROLE_NAME}** role.",
                ephemeral=True
            )
            return
        
        await member.remove_roles(premium_role, reason=f"Removed by {interaction.user.name}")
        
        await interaction.followup.send(
            f"✅ Removed **{PREMIUM_ROLE_NAME}** role from {member.mention}",
            ephemeral=True
        )
        
        logger.info(f'✅ Removed {PREMIUM_ROLE_NAME} role from {member.name} (ID: {user_id})')
    
    except Exception as e:
        logger.error(f'❌ Error in remove-premium command: {e}')
        await interaction.followup.send(
            f"❌ An error occurred: `{str(e)}`",
            ephemeral=True
        )

@bot.command(name='ping')
async def ping(ctx):
    """Simple ping command to test bot responsiveness"""
    await ctx.send(f'🏓 Pong! Latency: {round(bot.latency * 1000)}ms')

# Error handler
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ You don't have permission to use this command.")
    elif isinstance(error, commands.CommandNotFound):
        pass  # Ignore unknown commands
    else:
        logger.error(f'Command error: {error}')

# Run the bot
if __name__ == "__main__":
    if not DISCORD_TOKEN:
        logger.error("❌ DISCORD_TOKEN not found in .env file!")
        exit(1)
    
    try:
        bot.run(DISCORD_TOKEN)
    except Exception as e:
        logger.error(f"❌ Failed to start bot: {e}")
