import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';

/**
 * PUBLIC_INTERFACE
 * TrainerClients - List of assigned clients.
 */
export default function TrainerClients() {
  const [items] = React.useState([
    { id: 'cl1', name: 'Chris P', goal: 'Weight Loss' },
    { id: 'cl2', name: 'Morgan S', goal: 'Build Muscle' },
  ]);

  const columns = [
    { key: 'name', label: 'Client' },
    { key: 'goal', label: 'Goal' },
  ];

  return (
    <Card title="Clients" subtitle="Assigned clients">
      <SimpleTable columns={columns} data={items} />
    </Card>
  );
}
