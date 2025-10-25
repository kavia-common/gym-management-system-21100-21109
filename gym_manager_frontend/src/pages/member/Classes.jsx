import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * MemberClasses - Browse classes and book.
 */
export default function MemberClasses() {
  const [items] = React.useState([
    { id: 'mc1', title: 'Strength 101', trainer: 'Alex', when: 'Mon 10:00' },
    { id: 'mc2', title: 'Pilates', trainer: 'Sara', when: 'Tue 12:00' },
  ]);

  const columns = [
    { key: 'title', label: 'Class' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'when', label: 'Schedule' },
  ];

  const actions = (row) => (
    <Button size="sm" onClick={() => alert(`Booked ${row.title} (demo)`)}>Book</Button>
  );

  return (
    <Card title="Classes" subtitle="Available to book">
      <SimpleTable columns={columns} data={items} actions={actions} />
    </Card>
  );
}
