// utils/shiftTime.ts

export const isShiftStarted = (
  startTime: string,
  overnight: boolean
): boolean => {
  const now = new Date();
  const [startHour, startMinute] = startTime.split(":").map(Number);

  if (!overnight) {
    // shift normal: cek jam sekarang >= jam mulai
    const shiftStart = new Date();
    shiftStart.setHours(startHour, startMinute, 0, 0);
    return now >= shiftStart;
  }

  // shift overnight (misal 21:00 - 08:00)
  // aktif kalau jam sekarang >= 21:00 ATAU jam sekarang < 08:00
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowInMinutes = nowHour * 60 + nowMinute;
  const startInMinutes = startHour * 60 + startMinute;

  // >= 21:00 (sudah mulai malam ini)
  // ATAU < 08:00 (masih lanjutan dari malam sebelumnya)
  return nowInMinutes >= startInMinutes || nowHour < 8;
};

export const getShiftButtonState = (
  startTime: string,
  overnight: boolean,
  isCheckedIn: boolean,
  isCheckedOut: boolean
): {
  label: string;
  disabled: boolean;
  variant: "default" | "outline" | "ghost";
  hint: string | null;
} => {
  // sudah selesai
  if (isCheckedIn && isCheckedOut) {
    return {
      label: "Shift Selesai",
      disabled: true,
      variant: "ghost",
      hint: null,
    };
  }

  // sudah check in, belum check out
  if (isCheckedIn && !isCheckedOut) {
    return {
      label: "Check Out",
      disabled: false,
      variant: "outline",
      hint: null,
    };
  }

  // belum check in, cek apakah shift sudah mulai
  const started = isShiftStarted(startTime, overnight);

  if (!started) {
    return {
      label: "Check In",
      disabled: true,
      variant: "ghost",
      hint: `Tersedia mulai pukul ${startTime}`,
    };
  }

  return {
    label: "Check In",
    disabled: false,
    variant: "default",
    hint: "Lokasi akan diverifikasi saat check in",
  };
};