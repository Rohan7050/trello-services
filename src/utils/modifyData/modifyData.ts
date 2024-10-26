export const modifyData = (data: any) => {
  const read = data.read;
  const write = data.write;
  const module_access = data.module_access;
  const modules = module_access.map((mod: any) => {
    mod.readOnly = read.includes(mod.id);
    mod.fullAccess = write.includes(mod.id);
    return mod;
  });
  return modules;
};

export const getDateStr = () => {
  const date = new Date(); // Get the current date
  const options: any = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  let formattedDate = date.toLocaleDateString('en-US', options).replace(/\//g, ''); // Remove the slashes from the formatted string
  formattedDate = formattedDate.replace("PM", '')
  formattedDate = formattedDate.replace("AM", '')
  formattedDate = formattedDate.replace(/\s+/g, "")
  formattedDate = formattedDate.replace(/:/g, "")
  formattedDate = formattedDate.replace(/,/g, "")
  return formattedDate;
};
