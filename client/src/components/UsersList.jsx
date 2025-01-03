export default function UsersList({ users }) {
    return (
      <div className="users-list">
        <h3>Connected Users:</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.id}</li>
          ))}
        </ul>
      </div>
    );
  }