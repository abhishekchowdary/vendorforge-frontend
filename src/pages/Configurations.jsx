import Card from '../components/Card.jsx';

export default function Configurations() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="General Settings">
        Toggles and inputs for environment, keys, and preferences.
      </Card>
      <Card title="Integrations">
        Manage third-party connections. Add status badges and actions.
      </Card>
    </div>
  );
}
