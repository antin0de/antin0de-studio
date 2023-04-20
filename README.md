# antin0de-studio

My personal security research automation tool. **Still in active development, don't expect comprehensive documentation.**

![](https://i.imgur.com/OX3Uc5D.png)
![](https://i.imgur.com/oUAFW3z.png)

## Runners

To take full advantage over the tasks feature, you will need to configure task runners. They can run on any computers, and since they poll the API, they do not require a static IP address. It is very similar to how GitHub/GitLab runner works.

You can configure multiple runners, they simply poll tasks from a central queue.

To run the runners, just download the binary, and put a `.env` file along with it, with the following variables

```bash
ANTIN0DE_STUDIO_API_ENDPOINT="https://api.studio.antin0.de"
ANTIN0DE_STUDIO_API_PASSWORD="YOUR_PASSWORD_HERE"
# Path to the /tools directory, you will want to make sure you can run everything
# within that directory.
ANTIN0DE_STUDIO_TOOLS_DIR="/home/antin0de/antin0de-studio/tools"
```

## Tools

### bbot-scan

Do a bbot domain scan and store results in the database

```bash
# Interactive mode
sudo ./bbot-scan.sh -i
# Direct mode (-t domain, -n scan name, -p password)
sudo ./bbot-scan.sh -t owasp.org -n owasp-org -p localpass
```
