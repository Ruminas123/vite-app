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
    id: number,
    key: string;
    label: string;
    data: string;
    icon: string;
    children?: TreeNode[];
}

export const NodeService = {
    // Method to create the tree structure from the employees
    getTreeNodesDataEmployee(employees: Employee[]): TreeNode[] {
        function createEmployeeTree(employees: Employee[]): TreeNode[] {
            const nodeMap: Record<string, TreeNode> = {}; // Maps employee_key to TreeNode
            const result: TreeNode[] = [];

            // First pass: create all nodes
            employees.forEach(emp => {
                nodeMap[emp.employee_key] = {
                    id: emp.employee_id,
                    key: emp.employee_key,
                    label: emp.employee_fullname,
                    data: emp.employee_username,
                    icon: 'pi pi-fw pi-calendar',
                    children: []
                };
            });

            // Second pass: Assign children based on employee_key relationships
            employees.forEach(emp => {
                const key = emp.employee_key;
                const lastDashIndex = key.lastIndexOf('-');

                if (lastDashIndex !== -1) {
                    const parentKey = key.substring(0, lastDashIndex);
                    if (nodeMap[parentKey] && nodeMap[parentKey].children) {
                        nodeMap[parentKey].children.push(nodeMap[key]);
                    } else {
                        result.push(nodeMap[key]);
                    }
                } else {
                    result.push(nodeMap[key]);
                }
            });

            // Sort children by their keys numerically
            const sortChildren = (node: TreeNode) => {
                if (node.children && node.children.length > 0) {
                    node.children.sort((a, b) => {
                        const [aPart1, aPart2] = a.key.split('-').map(Number);
                        const [bPart1, bPart2] = b.key.split('-').map(Number);
                        if (aPart1 === bPart1) {
                            return aPart2 - bPart2; // If first parts are equal, compare second parts
                        }
                        return aPart1 - bPart1; // Compare first parts numerically
                    });
                    node.children.forEach(sortChildren); // Recursively sort any nested children
                }
            };

            // Apply sorting to all nodes' children
            result.forEach(sortChildren);

            // Remove empty children arrays
            const cleanupEmptyChildren = (node: TreeNode) => {
                if (node.children && node.children.length === 0) {
                    delete node.children;
                } else if (node.children) {
                    node.children.forEach(cleanupEmptyChildren);
                }
            };

            // Cleanup and sort the root nodes
            result.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
            result.forEach(cleanupEmptyChildren);

            console.log('result :>> ', result);  // Optionally log the result
            return result;
        }

        return createEmployeeTree(employees);  // Create the tree from the employees
    },

    // Method to get the sorted tree nodes
    getTreeNodes(employees: Employee[]): Promise<any> {
        return Promise.resolve(this.getTreeNodesDataEmployee(employees));
    }
};
