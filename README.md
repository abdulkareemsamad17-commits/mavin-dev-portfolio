# Mavin's Dev — E-commerce developer homepage

A responsive, multi-page portfolio built with HTML, CSS, and vanilla JavaScript. Home, Selected Work, Services, Platforms, Approach, About, and Contact each have their own HTML page and share the same responsive navigation. It has no build step or package dependencies.

## Personalize before publishing

1. Update the public contact email in `contact.html` if it changes.
2. Update the introduction and About copy when you are ready to finalize your positioning.
3. The storefront preview is a fictional concept study, not a client project. Replace it with real work only when you have project details to share.
4. The autoplaying hero video is a locally hosted Pexels clip by Yan Krukau. The platform section uses a Pexels clip by Kampus Production. Both videos and their posters are included in `assets/`. Keep the creator credits and license references with your project materials: <https://www.pexels.com/video/video-of-hands-using-droppers-7019510/>, <https://www.pexels.com/video/couple-busy-running-their-online-business-7288129/>, and <https://www.pexels.com/license/>.
5. Platform and tool marks in `assets/platform-logos/` are local SVGs from [Simple Icons](https://simpleicons.org/) (CC0); Klaviyo is shown as a text wordmark. Product and company names are trademarks of their respective owners; their appearance does not imply endorsement.

## Preview locally

Open `index.html` in a browser to start. Each page links to the others, and the video and logo assets are loaded from the local `assets/` folder. Google Fonts load over the internet; system fallbacks are provided.

## Publish with GitHub and Cloudflare Pages

1. Create a GitHub repository and push the project files, including the `assets/` folder.
2. In Cloudflare, open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select the repository and production branch (usually `main`).
4. Choose **None** as the framework preset, leave the build command blank, and set the build output directory to `/`.
5. Select **Save and Deploy**. Later pushes to the production branch will trigger new deployments.

This static site needs no API keys or deployment secrets.
