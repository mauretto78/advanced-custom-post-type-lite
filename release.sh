echo 'Install assets...'
rm -rf ./assets/build
yarn install
yarn build

php fix_vite_assets.php