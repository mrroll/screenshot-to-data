#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

IFS=$'\n\t'

__DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "${__DIR}"

__COMMAND=(
    npm
    run
    start
    describe-local-files
    --
    --files="${HOME}/Desktop/screenshots"
)

"${__COMMAND[@]}" | bun x pino-pretty@latest

__COMMAND=(
    npm
    run
    start
    describe-database-files
    --
    --take="5"
    # These don't do anything right now since it's difficult to test with all the load on Workspace's DB.
    --cursor-created-at="2024-03-19 15:20:23.831852+00"
    --cursor-id="10fe2003-061b-49c0-a88a-ab360fcd9d2d"
)

# "${__COMMAND[@]}" | bun x pino-pretty@latest
