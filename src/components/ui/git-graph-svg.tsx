export function ViewBox({ children }: { children?: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 200"
      xmlns="http://www.w3.org/2000/svg"
      className="size-full fill-none stroke-cyan-500 stroke-1"
    >
      {children}
    </svg>
  );
}

export function FullLine() {
  return (
    <ViewBox>
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="200"
      />
    </ViewBox>
  );
}

export function NoActivity() {
  return (
    <ViewBox></ViewBox>
  );
}

export function CommitLine() {
  return (
    <ViewBox>
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="90"
      />
      <circle
        cx="50"
        cy="100"
        r="10"
      />
      <line
        x1="50"
        y1="110"
        x2="50"
        y2="200"
      />
    </ViewBox>
  );
}

export function FirstCheckout() {
  return (
    <ViewBox>
      <path
        d="M 50 90 Q 50 20 0 25"
      />
      <circle
        cx="50"
        cy="100"
        r="10"
      />
      <line
        x1="50"
        y1="110"
        x2="50"
        y2="200"
      />
    </ViewBox>
  );
}

export function FirstCommit() {
  return (
    <ViewBox>
      <circle
        cx="50"
        cy="100"
        r="10"
      />
      <line
        x1="50"
        y1="110"
        x2="50"
        y2="200"
      />
    </ViewBox>
  );
}

export function LastCommit() {
  return (
    <ViewBox>
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="90"
      />
      <circle
        cx="50"
        cy="100"
        r="10"
      />

    </ViewBox>
  );
}

export function NoCommitCross() {
  return (
    <ViewBox>
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="200"
      />
      <line
        x1="0"
        y1="100"
        x2="100"
        y2="100"
      />
    </ViewBox>
  );
}

export function CheckoutCommitLine() {
  return (
    <ViewBox>
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="90"
      />
      <circle
        cx="50"
        cy="100"
        r="10"
      />
      <line
        x1="50"
        y1="110"
        x2="50"
        y2="200"
      />
      <line
        x1="60"
        y1="100"
        x2="100"
        y2="100"
      />

    </ViewBox>
  );
}

export function CheckoutNoCommitLine() {
  return (
    <ViewBox>
      <path
        d="M 0 100 Q 50 110 50 200"
      />
    </ViewBox>
  );
}

export function MergeNoCommitLine() {
  return (
    <ViewBox>
      <path
        d="M 50 0 Q 50 100  0 100"
      />
    </ViewBox>
  );
}

export function MergeAndCheckout() {
  return (
    <ViewBox>
      <path
        d="M 50 0 Q 50 100  0 100"
      />
      <line
        x1="0"
        y1="100"
        x2="100"
        y2="100"
      />
    </ViewBox>
  );
}

export function Connector() {
  return (
    <ViewBox>
      <line
        x1="0"
        y1="100"
        x2="100"
        y2="100"
      />
    </ViewBox>
  );
}
