import {
  Badge,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Domain, DomainService } from "../../services/DomainService";
import moment from "moment";
import { AiOutlineDownload } from "react-icons/ai";

export function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filter, setFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [shownDomains, setShownDomains] = useState<Domain[]>([]);

  const reloadDomains = async () => {
    const domains = await DomainService.listDomains();
    setDomains(domains);
  };

  useEffect(() => {
    reloadDomains();
  }, []);

  useEffect(() => {
    try {
      setShownDomains(
        domains.filter((domain) =>
          domain.fqdn.match(filter ? new RegExp(filter) : ".*")
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        window.alert(e.message);
      }
    }
  }, [domains, appliedFilter]);

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([shownDomains.map((d) => d.fqdn).join("\n")], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "domains.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex gap-8">
          <div>
            <Stat>
              <StatLabel>Total Domains</StatLabel>
              <StatNumber>{domains.length}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </div>
          <div>
            <Stat>
              <StatLabel>Total Services</StatLabel>
              <StatNumber>
                {domains
                  .map((domain) => domain.services.length)
                  .reduce((prev, cur) => prev + cur, 0)}
              </StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </div>
        </div>
        <div className="flex gap-2">
          <FormControl>
            <InputGroup size="sm">
              <Input
                placeholder=".*\.example\.com"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <InputRightElement width="7rem">
                <Button
                  h="1.75rem"
                  variant={"ghost"}
                  isDisabled={appliedFilter === filter}
                  size="xs"
                  onClick={() => {
                    setAppliedFilter(filter);
                  }}
                >
                  Apply Filter
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText className="text-xs">
              Use regular expressions to filter results by FQDN.
            </FormHelperText>
          </FormControl>
          <Button
            size="sm"
            leftIcon={<AiOutlineDownload />}
            onClick={downloadTxtFile}
          >
            TXT
          </Button>
        </div>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th className="ps-0">FQDN</Th>
                <Th>Services</Th>
                <Th>Created At</Th>
                <Th>ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {shownDomains.map((domain) => (
                <Tr key={domain.id}>
                  <Td className="ps-0">
                    <code>{domain.fqdn}</code>
                  </Td>
                  <Td>
                    <div className="max-w-sm whitespace-normal">
                      {domain.services.map((service) => (
                        <Badge className="mr-2" key={service.id}>
                          {service.name} ({service.port}/{service.protocol})
                        </Badge>
                      ))}
                    </div>
                  </Td>
                  <Td className="text-xs">
                    <code>{moment(domain.createdAt).calendar()}</code>
                  </Td>
                  <Td className="text-white/50 text-xs">
                    <code>{domain.id}</code>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
