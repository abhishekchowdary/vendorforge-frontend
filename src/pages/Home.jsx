import Card from '../components/Card.jsx';

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card title="Overview">
        Welcome to VendorForge. Use the navbar to navigate between modules.
      </Card>
      <Card title="Stats">
        Add KPI tiles and charts here. Hook these up to API data.
      </Card>
      <Card title="Activity">
        Recent updates and events will surface in this feed.
      </Card>
    </div>
  );
}
