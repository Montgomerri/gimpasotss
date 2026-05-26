type Props = {
  params: {
    id: string;
  };
};

export default function ProfilePage({ params }: Props) {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>User ID: {params.id}</p>
    </div>
  );
}