# Admin Authentication Setup Guide

## Phase 1 Complete ✅

The basic authentication for admin routes has been successfully implemented using Astro middleware.

## What Was Implemented

1. **Middleware Authentication** (`src/middleware.ts`)
   - Protects all `/admin/*` routes
   - Uses HTTP Basic Authentication
   - Reads credentials from environment variables
   - Returns 401 for unauthorized access

2. **Environment Configuration**
   - `.env.example` created with template
   - `.env` added to `.gitignore`
   - Uses `ADMIN_USERNAME` and `ADMIN_PASSWORD`

3. **Admin Landing Page** (`src/pages/admin/index.astro`)
   - Dashboard overview with links to future sections
   - Styled using existing design system
   - Mobile responsive

4. **Test Infrastructure**
   - `test-auth.html` for manual testing
   - Placeholder pages for admin routes

## Setup Instructions

### Local Development

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set secure credentials:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Test authentication:
   - Open `test-auth.html` in a browser
   - Or navigate to `http://localhost:4321/admin`
   - Enter your credentials when prompted

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `ADMIN_USERNAME` = your-username
   - `ADMIN_PASSWORD` = your-secure-password

4. Apply to Production, Preview, and Development environments as needed

## Security Best Practices

1. **Password Requirements**:
   - Use a password generator
   - Minimum 16 characters
   - Mix of letters, numbers, and symbols
   - Example: `xK9#mP2$vL6@nQ8*fR4!`

2. **Credential Management**:
   - Never commit passwords to git
   - Use different passwords for each environment
   - Rotate passwords periodically
   - Store passwords in a password manager

3. **Access Control**:
   - Limit who has access to Vercel environment variables
   - Consider IP restrictions for additional security
   - Monitor access logs

## Testing Authentication

### Manual Browser Test
1. Navigate to any `/admin` route
2. Browser will prompt for username/password
3. Enter credentials
4. Access granted or denied based on credentials

### Using the Test Page
1. Open `test-auth.html` in your browser
2. Click each test button:
   - Test 1: Verifies routes are protected
   - Test 2: Tests valid credentials
   - Test 3: Confirms public routes work

### Command Line Test
```bash
# Test without auth (should return 401)
curl -I http://localhost:4321/admin

# Test with auth (should return 200)
curl -I -u admin:your-password http://localhost:4321/admin
```

## Troubleshooting

### "Server configuration error" (500)
- Ensure `ADMIN_PASSWORD` is set in `.env`
- Restart the dev server after changing `.env`

### Authentication not working on Vercel
- Verify environment variables in Vercel dashboard
- Check deployment logs for errors
- Ensure middleware.ts is included in deployment

### Can't access admin pages after auth
- Clear browser cache/cookies
- Try incognito mode
- Check browser console for errors

## Next Steps

Phase 1 is complete! The authentication layer is working. Next phases:

- **Phase 2**: Create AdminLayout and dashboard components
- **Phase 3**: Build API endpoints for analytics data
- **Phase 4**: Implement dashboard pages with visualizations
- **Phase 5**: Add advanced features

## Files Modified/Created

- `src/middleware.ts` - Authentication middleware
- `.env.example` - Environment template
- `.gitignore` - Added .env and test files
- `src/pages/admin/index.astro` - Admin dashboard home
- `src/pages/admin/analytics/overview.astro` - Placeholder page
- `test-auth.html` - Testing interface
- `docs/internal/BI/authentication-setup.md` - This guide