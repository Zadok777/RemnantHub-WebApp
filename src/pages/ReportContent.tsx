import ReportingWorkflow from "@/components/reporting/ReportingWorkflow";

const ReportContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Report a Concern</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We take all concerns seriously and are committed to addressing them in a biblical manner 
          that prioritizes restoration and reconciliation.
        </p>
      </div>

      <ReportingWorkflow />
    </div>
  );
};

export default ReportContent;