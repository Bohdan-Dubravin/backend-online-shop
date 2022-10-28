class UserDto {
  id;
  email;
  active;
  username;
  role;

  constructor(model) {
    this.active = model.active;
    this.id = model._id;
    this.email = model.email;
    this.username = model.username;
    this.role = model.role;
  }
}

export default UserDto;
