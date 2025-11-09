package interfaces

import "Miscellaneous/models/structs"

type HistoryModel interface {
	GetDayHistory(data structs.DataDay) ([]structs.HistoryItem, *structs.CoreError)
	GetWeekHistory(data structs.DataWeek) ([]structs.HistoryItem, *structs.CoreError)
	GetMonthHistory(data structs.DataMonth) ([]structs.HistoryItem, *structs.CoreError)
}
