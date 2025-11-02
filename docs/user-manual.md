# StreamFlix user manual

This guide walks end users through the live StreamFlix deployment (Vercel frontend + Render backend). Follow the steps in order for the best experience.

## 1. Accessing the platform

1. Open the public URL: `https://streamflix.vercel.app` (replace with the latest deployment link if different).
2. Use Chrome, Edge, or Firefox on desktop or mobile. The site is fully responsive down to 360 px wide.
3. Allow the browser to load external media (videos and subtitles are served from the backend).

## 2. Creating an account

1. Click **Register** on the navbar or hero section.
2. Complete the form with first name, last name, age, email, and password.
3. Submit the form. You will be redirected to the home page and automatically signed in.
4. A JWT token is stored in `localStorage` (`sf_token`), enabling subsequent API calls.

## 3. Logging in and out

1. Visit the **Login** page and enter the email/password used during registration.
2. If you forget the password, click **Forgot password?**, enter your email, and follow the reset link delivered to your inbox.
3. Use the navbar profile dropdown to **Log out**, which clears local storage and returns you to the landing page.

## 4. Managing your profile

1. Navigate to **Profile** from the navbar.
2. Review account details (name, email, age, creation date).
3. Click **Edit** to update fields; click **Save** to persist changes.
4. To remove the account, press **Delete account** and confirm. You’ll be logged out automatically.

## 5. Exploring movies

1. Browse curated collections on the **Home** page or use categories and search.
2. Select a movie card to open the trailer page with synopsis, rating, and community section.
3. Press **Play trailer** to launch the modal player.

## 6. Playback controls and subtitles

1. Inside the player modal, use the standard video controls (play, pause, stop via close button).
2. Toggle subtitles with the buttons below the video:
   - **No subtitles** hides all tracks.
   - **Spanish subtitles** enables the Spanish VTT track (if available).
   - **English subtitles** enables the English VTT track (if available).
3. Closing the modal records playback progress with the backend.

## 7. Favorites, ratings, and comments

1. Click the **Add to favorites** heart icon on any movie card or trailer page to bookmark it. The icon toggles to remove the favorite.
2. Rate a movie from 1–5 stars in the **Rate this title** panel. Your score updates the global average instantly. Remove your rating with the **Clear rating** option.
3. Read community feedback in the **Comments** column. Post a new comment via the form; your message appears at the top.

## 8. Accessibility tips

- Use the **Tab** key to move between interactive elements; press **Escape** to close the player overlay.
- Screen readers announce all status changes thanks to `aria-live` regions and descriptive labels.
- Contrast ratios respect WCAG AA guidelines.

## 9. Troubleshooting

| Issue | Resolution |
| --- | --- |
| Video does not play | Refresh the page. If the issue persists, confirm the backend Render instance is running. |
| Subtitles unavailable | The selected movie may not have both languages. Try another title or contact support. |
| Password reset email missing | Check spam/junk folders. Tokens expire after 15 minutes; request a new email if necessary. |
| API errors | Open the browser console for error messages and share them with the development team. |

## 10. Support

For assistance, raise a ticket in Taiga under the “Support” swimlane or email the engineering team at `streamflix-team@example.com`.
