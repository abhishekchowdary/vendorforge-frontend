import Card from '../components/Card.jsx';

export default function TestCases() {
  return (
    <div className="grid gap-6">
      <Card title="Test Suite">
        Table of test cases with status, last run, and actions.
      </Card>
      <Card title="Run Tests" actions={<button className="btn btn-primary">Run</button>}>
        Trigger test execution and display progress here.
      </Card>
    </div>
  );
}
