# varsha.cat

A cute, mobile-first arcade game starring Varsha the cat. Built with HTML, CSS, and JavaScript, with no framework, runtime dependencies, or backend.

## Local development

Use Node.js 20 or newer:

```sh
npm run dev
```

Open <http://127.0.0.1:4173>. Edit files in `public/`, then refresh the page.

```sh
npm run build
```

The build copies the site into `dist/`, ready for Cloudflare Pages.

## Deploy automatically from main

The repository includes the Pages build configuration. The one-time Cloudflare account connection and custom domain setup still need to be completed.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Connect GitHub and select **rohittp0/cat**. Create the Pages project with these settings:

   | Setting | Value |
   | --- | --- |
   | Project name | `varsha-cat` |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | Leave blank (repository root) |

3. Save and deploy. Leave **automatic production branch deployments** enabled. After this connection, every push to `main` builds and deploys the site automatically.
4. In the Pages project, open **Custom domains** → **Set up a custom domain** and add **varsha.cat**. For an apex domain, `varsha.cat` must be a zone in the same Cloudflare account and use Cloudflare nameservers. Follow the dashboard's DNS and certificate setup prompts.

No GitHub deployment tokens or deployment workflow are needed with the native Git integration. `wrangler.toml` records the Pages project name and output directory; it does not create the account connection or DNS records. A screen asking for a **Deploy command** such as `npx wrangler deploy` is the Workers setup; choose **Pages** instead.

## Play

The page opens straight into the game. Move Varsha by tapping or dragging across the play area, pressing the arrow keys, or using the on-screen directional controls. She walks toward nearby destinations and runs toward distant ones.

Catch falling fish, yarn, and hearts to earn points during each 45-second round. Pause or restart whenever you like, then play again to beat your best score. Best scores are saved in this browser. The room stays in night mode. Original music and sound effects are on by default and begin with your first interaction; the speaker button in the top-right corner mutes both. All controls sit over the game so the room fills the screen. Fonts and artwork are served locally.

Each round ends with a shareable illustrated PNG scorecard. Share it through the native share sheet where supported, or save the image and copy the challenge. The description includes `https://varsha.cat` so friends can play too.

Cloudflare's official guides: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) and [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
