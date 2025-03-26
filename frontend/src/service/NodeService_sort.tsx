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
interface TreeNode {
  key: string;
  label: string;
  data: string;
  icon: string;
  expanded?: boolean;
  children?: TreeNode[];
}
export const NodeService = {
  getTreeNodesDataEmployee(employees: Employee[]) {
      function createEmployeeTree(employees: Employee[]): TreeNode[] {
          const nodeMap: Record<string, TreeNode> = {};
          const result: TreeNode[] = [];
          employees.forEach(emp => {
              nodeMap[emp.employee_key] = {
                  key: emp.employee_key,
                  label: emp.employee_fullname,
                  data: emp.employee_username,
                  icon: 'pi pi-fw pi-calendar',
                  expanded: true,
                  children: []
              };
          });
          employees.forEach(emp => {
              const key = emp.employee_key;
              const lastDashIndex = key.lastIndexOf('-');

              if (lastDashIndex !== -1) {
                  const parentKey = key.substring(0, lastDashIndex);
                  if (nodeMap[parentKey] && nodeMap[parentKey].children) {
                      nodeMap[parentKey].children.push(nodeMap[key]);
                  } else {result.push(nodeMap[key])}
              } else {result.push(nodeMap[key]);}
          });

          const cleanupEmptyChildren = (node: TreeNode) => {
              if (node.children && node.children.length === 0) {
                  delete node.children;
              } else if (node.children) {
                  node.children.forEach(cleanupEmptyChildren);
              }
          };

          // Sort nodes by key (with numeric sorting for natural order)
          result.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
          result.forEach(cleanupEmptyChildren);
          console.log('result :>> ', result);
          return result;
      }

      return createEmployeeTree(employees);
  },


  getTreeNodes(employees: Employee[]): Promise<any> {
      console.log('employees :>> ', employees);

      const sortedEmployees = employees.sort((a, b) => {
          const [aPart1, aPart2] = a.employee_key.split('-').map(Number);
          const [bPart1, bPart2] = b.employee_key.split('-').map(Number);
          if (aPart1 === bPart1) {
              return aPart2 - bPart2; // Compare second part if first parts are equal
          }
          return aPart1 - bPart1; // Compare first parts
      });
      
      // Print the sorted employees
      sortedEmployees.forEach(employee => {
          console.log(employee.employee_key);
      });

      return Promise.resolve(this.getTreeNodesDataEmployee(employees));
  }
};
