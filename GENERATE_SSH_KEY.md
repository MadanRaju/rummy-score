# 🔑 Generate SSH Key Guide

## Quick Method (Recommended)

### Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**Replace `your_email@example.com` with your actual email address.**

### Step 2: Follow Prompts

When prompted:
- **"Enter file in which to save the key"**: Press Enter (default: `~/.ssh/id_ed25519`)
- **"Enter passphrase"**: Either press Enter for no passphrase, or enter a secure passphrase
- **"Enter same passphrase again"**: Confirm your passphrase (or press Enter)

### Step 3: Start SSH Agent

```bash
eval "$(ssh-agent -s)"
```

### Step 4: Add Key to SSH Agent

```bash
ssh-add ~/.ssh/id_ed25519
```

### Step 5: Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output (starts with `ssh-ed25519`).

## Alternative: RSA Key (Older Systems)

If your system doesn't support Ed25519:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Then use `~/.ssh/id_rsa` instead of `~/.ssh/id_ed25519` in the steps above.

## Add to GitHub/GitLab

1. Copy your public key: `cat ~/.ssh/id_ed25519.pub`
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Paste your public key
4. Save

## Add to Expo/EAS (if needed)

EAS typically uses authentication tokens, not SSH keys. But if you need SSH for Git:

1. Ensure your SSH key is added to your Git provider (GitHub/GitLab)
2. Test connection: `ssh -T git@github.com` (or your Git provider)

## Verify SSH Key

```bash
# List all SSH keys
ls -la ~/.ssh/

# Test GitHub connection
ssh -T git@github.com

# Test GitLab connection
ssh -T git@gitlab.com
```

## Troubleshooting

### Permission Issues
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### Key Not Found
- Make sure you're using the correct path: `~/.ssh/id_ed25519`
- Check if key exists: `ls -la ~/.ssh/`

### SSH Agent Not Running
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## Complete Example

```bash
# Generate key
ssh-keygen -t ed25519 -C "madan@example.com"

# Start agent
eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519

# Display public key (copy this)
cat ~/.ssh/id_ed25519.pub

# Test GitHub
ssh -T git@github.com
```

## Notes

- **Private key** (`id_ed25519`): Keep this secret, never share
- **Public key** (`id_ed25519.pub`): Safe to share, add to Git providers
- **Ed25519**: Modern, secure, recommended
- **RSA 4096**: Alternative if Ed25519 not supported

