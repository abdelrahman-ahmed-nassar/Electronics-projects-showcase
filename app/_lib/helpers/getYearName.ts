const getYearName = function (year: string | undefined): string {

  
  switch (year) {
    case "1":
      return "الصف الأول الإعدادي";
    case "2":
      return "الصف الثاني الإعدادي";
    case "3":
      return "الصف الثالث الإعدادي";
    case "4":
      return "الصف الأول الثانوي";
    case "5":
      return "الصف الثاني الثانوي";
    case "6":
      return "الصف الثالث الثانوي";
    default:
      return "";
  }
};

export default getYearName;