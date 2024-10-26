type randomStrType = 'otp' | 'password' | 'random';
export const makeRandomStr = (len: number, type: randomStrType): string => {
  len = type === 'password' ? len - 2 : len;
  const otp = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const words = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  let id = '';
  const array = type === 'otp' ? otp : words;
  // let length = Math.floor((Math.random() * 3) + 20)
  for (let i = 0; i < len; i++) {
    let idx = Math.floor(Math.random() * array.length);
    let letter = array[idx];
    id = id + letter;
  }
  id = type === 'password' ? id[0].toUpperCase() + id.slice(1) : id;
  id = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(id[0]) ? 'R' + id.slice(1) : id;
  return type === 'password' ? id + '@' + `${Math.floor(Math.random() * 9)}` : id;
};

export const truncateString = (string = '', maxLength = 50) => (string.length > maxLength ? `${string.substring(0, maxLength)}…` : string);
