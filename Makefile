.PHONY:post

# First time setup
setup:
	@echo "Assumes you've ran 'gem install bundler' first."
	bundle
	npm install

# Build & watch for changes
watch:
	bundle exec jekyll serve -w

# Make a new post
post:
	@read -p "Your post title: " title; \
	bundle exec jekyll post $$title

lint:
	npm run lint
