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
import { useNavigate } from "react-router-dom";

export function TasksPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filter, setFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [shownDomains, setShownDomains] = useState<Domain[]>([]);
  const navigate = useNavigate();

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

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-8">
          <div>
            <Stat>
              <StatLabel>Total Tasks</StatLabel>
              <StatNumber>{domains.length}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </div>
          <div>
            <Stat>
              <StatLabel>Total Runs</StatLabel>
              <StatNumber>
                {domains
                  .map((domain) => domain.services.length)
                  .reduce((prev, cur) => prev + cur, 0)}
              </StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </div>
          <div>
            <Stat>
              <StatLabel>Runs in Queue</StatLabel>
              <StatNumber>
                {domains
                  .map((domain) => domain.services.length)
                  .reduce((prev, cur) => prev + cur, 0)}
              </StatNumber>
              <StatHelpText>Current</StatHelpText>
            </Stat>
          </div>
        </div>
      </div>
      <div>
        <Button size="sm" onClick={() => navigate("/dashboard/tasks/create")}>
          Create Task
        </Button>
      </div>
      <div className="flex gap-8">
        <div className="w-96">
          <h2 className="text-xl">Tasks</h2>
        </div>
        <div className="flex-1">
          <h2 className="text-xl">Task Details</h2>
          <div className="text-sm text-white/50">
            Choose a task on the left to see its details
          </div>
        </div>
      </div>
    </div>
  );
}
