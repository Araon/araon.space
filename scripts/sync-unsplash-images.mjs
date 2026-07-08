import "dotenv/config";

const siteUrl = process.env.SITE_URL || "https://araon.space";
const secret = process.env.STORE_IMAGES_SECRET;

if (!secret) {
  console.error("STORE_IMAGES_SECRET is required.");
  process.exit(1);
}

const response = await fetch(`${siteUrl}/api/storeImages`, {
  headers: {
    Authorization: `Bearer ${secret}`,
  },
});

const body = await response.text();

if (!response.ok) {
  console.error(body);
  process.exit(1);
}

console.log(body);
