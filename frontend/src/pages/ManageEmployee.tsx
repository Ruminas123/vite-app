import { useState, useEffect, useRef } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Tree, TreeDragDropEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { NodeService } from '../service/NodeService.tsx';
import './../css/manageEmployee.scss';

interface Employee {
  employee_id: number;
  employee_permission_id: number;
  employee_department_id: number;
  employee_position_id: number;
  employee_key: string;
  employee_fullname: string;
  employee_username: string;
  employee_password: string;
  employee_status: number;
  employee_date: string;
}

export function ManageEmployee() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any>(null);
  const treeRef = useRef<any>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/employees")
      .then((response: AxiosResponse<Employee[]>) => {
        setEmployees(response.data);
        NodeService.getTreeNodes(response.data).then((data) => {
          setNodes(data);
          expandAllNodes(data);
        });
      })
      .catch((err: AxiosError) => {
        console.error('Error fetching employees:', err);
      });
  }, []);

  const expandAllNodes = (nodes: TreeNode[]) => {
    const keysToExpand: { [key: string]: boolean } = {};
    const collectKeys = (nodes: TreeNode[], parentKey: string = '') => {
      nodes.forEach((node, index) => {
        const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
        keysToExpand[currentKey] = true;
        if (node.children) {
          collectKeys(node.children, currentKey);
        }
      });
    };

    collectKeys(nodes);
    setExpandedKeys(keysToExpand);
  };

  const collapseAllNodes = () => {
    setExpandedKeys({});
  };

  const resetKeys = (nodes: TreeNode[], parentKey: string = ''): TreeNode[] => {
    return nodes.map((node, index) => {
      const newKey = parentKey ? `${parentKey}-${index}` : `${index}`;
      const newNode: TreeNode = {...node, key: newKey, children: node.children ? resetKeys(node.children, newKey) : []};
      return newNode;
    });
  };

  const handleDragDrop = async (e: TreeDragDropEvent) => {
    const updatedNodes = resetKeys(e.value);
    expandAllNodes(updatedNodes);
    setNodes(updatedNodes);
    console.log('updatedNodes :>> ', updatedNodes);
    // Make a request to the backend to update employee keys
    try {
      await axios.post("http://localhost:5000/updatekeyfromID", updatedNodes);
      console.log('Employee keys updated successfully!');
    } catch (err) {
      console.error('Error updating employee keys:', err);
    }
  };

  return (
    <>
      <div id="manageEmployee">
        <Autocomplete
          options={employees}
          getOptionLabel={(employee) => employee.employee_fullname}
          value={selectedEmployee}
          onChange={(event, newValue) => setSelectedEmployee(newValue)}
          renderInput={(params) => <TextField {...params} label="ค้นหาพนักงาน" variant="outlined" />}
          fullWidth
        />
        <div id="Tree">
          <Tree
            ref={treeRef}
            value={nodes}
            expandedKeys={expandedKeys}
            onToggle={(e) => setExpandedKeys(e.value)}
            dragdropScope="demo"
            onDragDrop={handleDragDrop}
            className="body"
          />
        </div>
      </div>
    </>
  );
}
