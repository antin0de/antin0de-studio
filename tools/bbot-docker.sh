#!/bin/bash

docker run --rm -v "$HOME/.bbot:/root/.bbot" -v "$HOME/.config/bbot:/root/.config/bbot" blacklanternsecurity/bbot:stable "$@"