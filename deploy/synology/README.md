# Synology NAS Deployment

## 1. Deployment flow

A push to `dev` runs tests in GitHub Actions and publishes `ghcr.io/yuris99/exam-practice:dev` for `linux/amd64`. Synology Task Scheduler runs `update.sh` every five minutes. Docker Compose only recreates the app when the image digest changes.

The Intel Celeron J3455 uses the `linux/amd64` image.

## 2. Publish the first image

1. Push the local `dev` branch to GitHub.
2. Open the repository's **Actions** tab and confirm that **Publish container** succeeds.
3. Open the new `exam-practice` package on GitHub, choose **Package settings**, and change its visibility to public.

GitHub Container Registry packages may initially be private even when the source repository is public. The NAS can pull a public package without registry credentials.

## 3. Create the Synology project

1. Copy this `deploy/synology` directory to a persistent NAS directory such as `/volume1/docker/exam-practice`.
2. In DSM Container Manager, open **Project**, choose **Create**, select `compose.yaml`, and build the project.
3. Open `http://NAS_IP:3000` and verify the site.
4. Open `http://NAS_IP:3000/api/health` and verify that it returns `{"status":"ok"}`.

To use a different host port, create a `.env` file beside `compose.yaml` containing `APP_PORT=desired_port` before creating the project.

## 4. Enable five-minute updates

In DSM **Control Panel → Task Scheduler**, create a user-defined scheduled task with these settings:

- User: an administrator allowed to run Docker
- Schedule: every five minutes
- Command: `sh /volume1/docker/exam-practice/update.sh`

Run the task once manually and check its result. Every future `dev` push publishes a verified image, and the NAS picks it up within approximately five minutes.

## 5. Reverse proxy and HTTPS

In DSM **Control Panel → Login Portal → Advanced → Reverse Proxy**, forward the desired HTTPS hostname to `http://127.0.0.1:3000`. Assign a Synology or Let's Encrypt certificate to that hostname. HTTPS is required for reliable PWA installation outside localhost.

After the reverse proxy works, optionally restrict port 3000 to the local network with the DSM firewall.

## 6. Optional AI settings

Create a `.env` file beside `compose.yaml` only when live AI explanations are activated:

```dotenv
GEMINI_API_KEY=replace_me
GEMINI_MODEL=gemini-3.5-flash
AI_DAILY_LIMIT=100
```

Rebuild the Container Manager project after changing environment variables. Do not commit this `.env` file.

## 7. Switching the package to private

The GitHub repository and GHCR package visibility are separate. The repository may be made private later. If the GHCR package is also private, create a classic GitHub personal access token with only `read:packages`, then sign in once on the NAS:

```sh
echo 'TOKEN' | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
```

After login, the same Compose file and update schedule continue to work. Revoke and replace the token if it is exposed.

## 8. Rollback

Each image is also published with its full Git commit SHA. To roll back, replace `:dev` in `compose.yaml` with `:COMMIT_SHA`, recreate the project, and verify `/api/health`. Restore `:dev` when ready to resume automatic updates.
