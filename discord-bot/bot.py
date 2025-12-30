import discord
from discord.ext import commands
from discord import app_commands
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('discord_bot')

# Bot configuration
DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
PREMIUM_ROLE_NAME = os.getenv('PREMIUM_ROLE_NAME', 'Premium')
ADMIN_ROLE_NAME = os.getenv('ADMIN_ROLE_NAME', 'Admin')

# Bot setup
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

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
    Usage: /verify <user_id> <payment_amount> [payment_reference]
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
    
    # Defer response since we might take a moment
    await interaction.response.defer(ephemeral=True)
    
    try:
        # Convert user_id to integer
        user_id_int = int(user_id)
        
        # Find the user in the guild
        member = interaction.guild.get_member(user_id_int)
        
        if not member:
            await interaction.followup.send(
                f"❌ User with ID `{user_id}` not found in this server.\n"
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
            premium_role = await interaction.guild.create_role(
                name=PREMIUM_ROLE_NAME,
                color=discord.Color.from_rgb(0, 255, 163),  # Neon green
                hoist=True,  # Display separately in member list
                mentionable=True,
                reason="Premium role created by verification bot"
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
