#!/usr/bin/env bash
set -e

# bump-version.sh: Automatically bumps SemVer version, updates project files, commits and tags it.

# 1. Determine current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# 2. Parse argument (bump type or specific version)
ARG=${1:-patch}

if [[ $ARG =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW_VERSION=$ARG
else
  # Split version parts
  IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"

  case "$ARG" in
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    patch)
      patch=$((patch + 1))
      ;;
    *)
      echo "Usage: $0 [major|minor|patch|X.Y.Z]"
      exit 1
      ;;
  esac
  NEW_VERSION="$major.$minor.$patch"
fi

NEW_TAG="v$NEW_VERSION"
echo "Bumping to: $NEW_VERSION"

# 3. Update files
echo "Updating files..."

# 3.1 Update package.json (and package-lock.json)
npm version "$NEW_VERSION" --no-git-tag-version

# 3.2 Update test/index.spec.ts
sed -i "s/\"$CURRENT_VERSION\"/\"$NEW_VERSION\"/g" test/index.spec.ts

echo "Files updated successfully."

# 4. Run tests
echo "Running tests to verify suite sanity..."
npm run test -- --run

# 5. Git commit & tag
echo "Committing version bump..."
git add package.json test/index.spec.ts
if [ -f "package-lock.json" ]; then
  git add package-lock.json
fi

git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "$NEW_TAG" -m "Release $NEW_TAG"

# 6. Push to origin
echo "Pushing changes and tag to origin..."
# We assume 'main' is the default branch. 
# Alternatively use $(git rev-parse --abbrev-ref HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin "$CURRENT_BRANCH"
git push origin "$NEW_TAG"

# 7. Create GitHub Release (if gh CLI is available)
if command -v gh &> /dev/null; then
  echo "GitHub CLI found. Creating GitHub release for $NEW_TAG..."
  gh release create "$NEW_TAG" --title "$NEW_TAG" --notes "Release version $NEW_TAG"
else
  echo "GitHub CLI (gh) not found. Skipping release creation."
fi

echo "=============================================="
echo "Successfully bumped version and released $NEW_TAG!"
echo "=============================================="
