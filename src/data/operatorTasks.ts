export type TaskStatus = "new" | "assigned" | "in_progress" | "blocked" | "done" | "overdue";
export type TaskKind = "night" | "printer" | "maintenance" | "incident";

export type OperatorTask = {
  id: string;
  title: string;
  object: string;
  location: string;
  reason: string;
  unlocks: string;
  due: string;
  status: TaskStatus;
  kind: TaskKind;
  assignee?: string;
  checklist: string[];
  sensor: string;
  impact: number;
};

export const operatorTasks: OperatorTask[] = [
  { id: "TASK-184", title: "Освободить тару годных деталей", object: "Тара A-17", location: "Стойка A", reason: "Тара заполнена на 92%. Печать A4 остановится после текущего слоя.", unlocks: "8 принтеров и ночной preflight стойки A", due: "24 мин", status: "assigned", kind: "night", assignee: "Анна", checklist: ["Переместить детали в постобработку", "Вернуть пустую тару в ячейку A-17", "Дождаться подтверждения весов"], sensor: "Вес тары меньше 0,8 кг", impact: 8 },
  { id: "TASK-183", title: "Заменить катушку PETG", object: "K1C-06 · катушка #17", location: "Стойка B", reason: "Остатка PETG не хватит на серию #024.", unlocks: "3 ч 20 мин очереди", due: "18 мин", status: "overdue", kind: "night", checklist: ["Снять катушку #17", "Установить резервную PETG", "Подтвердить материал и цвет"], sensor: "RFID новой катушки считан", impact: 1 },
  { id: "TASK-181", title: "Проверить поверхность PEI", object: "K1C-02 · INC-148", location: "Стойка A", reason: "VLM отметил неоднородность первого слоя после очистки.", unlocks: "принтер и 12 деталей", due: "42 мин", status: "in_progress", kind: "incident", assignee: "Анна", checklist: ["Осмотреть PEI при боковом свете", "Очистить поверхность", "Запустить контрольный first layer"], sensor: "Контрольный кадр принят CV", impact: 1 },
  { id: "TASK-178", title: "Провести тест пожарной цепи", object: "Контур FIRE-A", location: "Стойки A–B", reason: "Плановая проверка перед ночным режимом.", unlocks: "разрешение ночного запуска", due: "до 21:00", status: "blocked", kind: "maintenance", checklist: ["Проверить аппаратную кнопку", "Получить heartbeat ESP32", "Записать результат теста"], sensor: "Требуется роль администратора", impact: 8 },
  { id: "TASK-176", title: "Забрать детали из зоны C", object: "Тара C-04", location: "Стойка C", reason: "Плановое освобождение зоны готовых деталей.", unlocks: "4 свободных слота хранения", due: "2 ч 10 мин", status: "new", kind: "printer", checklist: ["Сверить количество деталей", "Переместить тару", "Подтвердить свободный слот"], sensor: "Весы зоны C в норме", impact: 4 },
];
