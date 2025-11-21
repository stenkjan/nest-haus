# Map Coordinate Verification Test

## Test Locations

Use these well-known cities to verify the map coordinate alignment:

| City | Country | Expected Position | Lat/Lng |
|------|---------|------------------|---------|
| Vienna | Austria | Central Europe | 48.21°, 16.37° |
| Tokyo | Japan | Eastern Asia | 35.68°, 139.65° |
| New York | USA | Eastern North America | 40.71°, -74.01° |
| Sydney | Australia | Southeastern Australia | -33.87°, 151.21° |
| London | UK | Western Europe | 51.51°, -0.13° |
| São Paulo | Brazil | Southeastern South America | -23.55°, -46.63° |
| Cape Town | South Africa | Southern tip of Africa | -33.92°, 18.42° |
| Singapore | Singapore | Southeast Asia | 1.29°, 103.85° |

## Visual Verification Steps

1. Navigate to `http://localhost:3000/admin/user-tracking`
2. Switch to **Map View**
3. Verify each dot appears in the correct geographic region:
   - **Vienna** should be in the **Austria area** (central Europe, not Siberia)
   - **Tokyo** should be in **Japan** (far eastern Asia)
   - **New York** should be on the **US East Coast**
   - **Sydney** should be in **southeastern Australia**
   - **London** should be in **southern UK**

## Known Coordinate Ranges (after transform)

The `react-svg-worldmap` with transform `scale(0.7125) translate(0, 240)` maps coordinates as follows:

- **X-axis**: Longitude -180° to +180° → 0 to 960 (before scale) → 0 to 684 (after scale)
- **Y-axis**: Latitude +85° to -85° → 0 to 500 (before scale) → 240 to 596 (after scale + translate)

## Expected Results

✅ **Pass**: All city dots align with their respective countries on the map  
❌ **Fail**: Dots appear offset or in wrong countries (e.g., Vienna in Siberia)

## Test with Real Data

If you have active sessions from different countries:

1. Check the **All Users** section for IP-based locations
2. Compare the map dots with the city names in the cards below the map
3. Click on a dot and verify the selected country matches the card data

## Debugging Tips

If coordinates still appear wrong:

1. **Check browser console** for any errors in coordinate calculation
2. **Inspect the SVG** using browser DevTools:
   - The overlay SVG should have `viewBox="0 0 1104 513"`
   - The `<g>` element should have `transform="translate(0, 0) scale(0.7125) translate(0, 240)"`
3. **Verify transform matches** the base map's `<g>` transform
4. **Check coordinate values** in the browser console:
   ```javascript
   // In browser console, run:
   document.querySelectorAll('circle[cx]').forEach(c => {
     console.log(`City at cx=${c.getAttribute('cx')}, cy=${c.getAttribute('cy')}`);
   });
   ```

## Production Verification

After deploying to Vercel:

1. Navigate to the production `/admin/user-tracking` page
2. Repeat the visual verification steps above
3. The map should render identically to local development

---

**Status**: Ready for testing  
**Last Updated**: 2025-11-21

