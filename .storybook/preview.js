export const decorators = [
  (Story) => (
    <div style={{ alignItems: "center", display: "flex", justifyContent: "center", flex: 1 }}>
      <Story />
    </div>
  ),
];
