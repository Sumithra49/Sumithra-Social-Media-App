// src/pages/Term.jsx
const Term = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-primary-500">Terms & Conditions</h1>
      <p>
        By using Sumithra Social Media App, you agree to our terms and conditions. We encourage respectful interaction, responsible sharing,
        and protection of user data.
      </p>
      <ul className="list-disc pl-6">
        <li>Do not post harmful or offensive content.</li>
        <li>Respect privacy of all users.</li>
        <li>Account activity is monitored for abuse prevention.</li>
      </ul>
      <p>
        Failure to comply with these terms may result in account suspension or removal.
      </p>
    </div>
  );
};

export default Term;
