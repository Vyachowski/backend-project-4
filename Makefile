# App actions
install:
	npm ci
run:
	bin/pageLoader.js $(url) $(dir)
# Linter actions
lint:
	npx eslint . --fix
# Test actions
test:
	npm run test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
# Package actions
publish:
	npm publish --dry-run
link:
	npm link
unlink:
	npm remove -g @hexlet/code
