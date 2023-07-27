const REGEX = /^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,8}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const DONE_CODE = 200;
const CREATE_CODE = 201;

module.exports = {
  REGEX,
  DONE_CODE,
  CREATE_CODE,
};
