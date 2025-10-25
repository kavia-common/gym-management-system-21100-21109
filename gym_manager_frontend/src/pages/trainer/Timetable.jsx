import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';

/**
 * PUBLIC_INTERFACE
 * TrainerTimetable - Shows trainer's upcoming classes/sessions.
 */
export default function TrainerTimetable() {
  const [items] = React.useState([
    { id: 'tt1', time: '09:00', title: 'HIIT', location: 'Studio A' },
    { id: 'tt2', time: '11:00', title: 'Strength', location: 'Studio B' },
    { id: 'tt3', time: '14:00', title: 'Yoga', location: 'Studio C' },
  ]);

  const columns = [
    { key: 'time', label: 'Time' },
    { key: 'title', label: 'Class' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <Card title="Timetable" subtitle="Today">
      <SimpleTable columns={columns} data={items} />
    </Card>
  );
}
