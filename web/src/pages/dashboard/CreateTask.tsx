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
import { AiOutlineCaretLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export function CreateTaskPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <Button
          size="sm"
          variant={"outline"}
          leftIcon={<AiOutlineCaretLeft />}
          onClick={() => navigate("/dashboard/tasks")}
        >
          Back
        </Button>
      </div>
      <h2 className="text-xl">Create Task</h2>
    </div>
  );
}
