import Planner from '../../entities/planner.entities';

export const markPhoneNum = (phone) => {
  return (phone =
    phone.length === 11
      ? phone.slice(0, 3) + '****' + phone.slice(7, 11)
      : phone.length === 10
      ? phone.slice(0, 3) + '***' + phone.slice(6, 10)
      : phone);
};
