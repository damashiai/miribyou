#!/bin/bash
set -e

# Target version argument check
if [ -z "$1" ]; then
  echo "Error: Please specify the version to bump to (e.g., 4.1.2)."
  exit 1
fi

VERSION=$1

# Basic semver format check
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must follow semver format X.Y.Z (e.g., 4.1.2)."
  exit 1
fi

echo "Bumping version to v$VERSION..."

# Get current version from package.json
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
echo "Current version is v$CURRENT_VERSION."

# 1. Update package.json
sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$VERSION\"/g" package.json

# 2. Update README.md
sed -i "s/- \*\*Version:\*\* \`$CURRENT_VERSION\`/- \*\*Version:\*\* \`$VERSION\`/g" README.md

# 3. Update test/index.spec.ts
sed -i "s/\"$CURRENT_VERSION\"/\"$VERSION\"/g" test/index.spec.ts

echo "Updated files successfully."

# 4. Run tests before committing
echo "Running tests to verify type safety and suite sanity..."
npm run test -- --run

# 5. Commit the changes
echo "Committing version bump..."
git add package.json README.md test/index.spec.ts
git commit -m "chore: bump version to v$VERSION"

# 6. Create Git Tag
TAG_NAME="v$VERSION"
echo "Creating git tag $TAG_NAME..."
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"

# 7. Push commits and tags to origin
echo "Pushing changes and tag to origin..."
git push origin main
git push origin "$TAG_NAME"

# 8. Create GitHub Release (if gh CLI is available)
if command -v gh &> /dev/null; then
  echo "GitHub CLI found. Creating GitHub release for $TAG_NAME..."
  gh release create "$TAG_NAME" --title "$TAG_NAME" --notes "Release version $TAG_NAME"
else
  echo "GitHub CLI (gh) not found. Skipping release creation."
fi

echo "Version bump and release process finished successfully!"
