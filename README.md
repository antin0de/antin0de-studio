# antin0de-studio

My personal security research automation tool. **Still in active development, don't expect comprehensive documentation.**

![](https://i.imgur.com/OX3Uc5D.png)
![](https://i.imgur.com/oUAFW3z.png)

## Tools

### bbot-scan

Do a bbot domain scan and store results in the database

```bash
# Interactive mode
sudo ./bbot-scan.sh -i
# Direct mode (-t domain, -n scan name, -p password)
sudo ./bbot-scan.sh -t owasp.org -n owasp-org -p localpass
```
