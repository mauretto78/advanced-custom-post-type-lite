# ACPT Lite

The free version of [ACPT](https://acpt.io), published on [wordpress.org](https://wordpress.org/plugins/acpt-lite/).

Create and manage custom post types, taxonomies and custom fields (Text, Textarea, Email, Select, Date)
from a drag-and-drop interface, with WooCommerce product data and a Gutenberg block.

## How this repository is built

This repository is **generated**: every release is extracted from a stable ACPT release by an automated
pipeline, and published to wordpress.org when `master` is updated. Please open issues here, but do not
expect pull requests to be merged directly: fixes land in ACPT and reach ACPT Lite with the next release.

## Development

```bash
composer install
pnpm install
pnpm build   # writes assets/build
```

## License

GPL-3.0-or-later
