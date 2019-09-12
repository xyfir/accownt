if [ "$PACKAGE" != "." ]; then
  cp example.env .env
  npm t
  npm run build
fi