package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"context"
	"time"
)

type HistoryModule struct {
	interfaces.HistoryModel
}

func (h HistoryModule) GetDayHistory(data structs.DataDay) ([]structs.HistoryItem, *structs.CoreError) {
	start := time.Date(data.Year, time.Month(data.Month), data.Day, 0, 0, 0, 0, time.UTC)
	end := time.Date(data.Year, time.Month(data.Month), data.Day, 23, 59, 59, 0, time.UTC)

	res, err := historyModel.GetByRange(context.Background(), &grpcs.GetByRangeArgs{
		Start: start.UnixMilli(),
		End:   end.UnixMilli(),
	})
	if err != nil {
		return nil, &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo obtener el historial",
			IsInternal: true,
		}
	}

	items := res.GetItems()
	results := []structs.HistoryItem{}
	for _, item := range items {
		results = append(results, structs.HistoryItem{
			Id:      item.GetId(),
			Product: item.GetProduct(),
			User:    item.GetUser(),
			Date:    item.GetDate(),
			Count:   item.GetCount(),
			Total:   item.GetTotal(),
		})
	}
	return results, nil
}

func (h HistoryModule) GetWeekHistory(data structs.DataWeek) ([]structs.HistoryItem, *structs.CoreError) {
	jan4 := time.Date(data.Year, time.January, 5, 0, 0, 0, 0, time.UTC)
	isoYear, isoWeek := jan4.ISOWeek()
	for isoYear != data.Year || isoWeek != 1 {
		jan4 = jan4.AddDate(0, 0, -1)
		isoYear, isoWeek = jan4.ISOWeek()
	}
	offsetDays := (data.Week - 1) * 7
	start := jan4.AddDate(0, 0, offsetDays)
	end := start.AddDate(0, 0, 6).Add(time.Hour*23 + time.Minute*59 + time.Second*59 + time.Millisecond*999)

	res, err := historyModel.GetByRange(context.Background(), &grpcs.GetByRangeArgs{
		Start: start.UnixMilli(),
		End:   end.UnixMilli(),
	})
	if err != nil {
		return nil, &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo obtener el historial",
			IsInternal: true,
		}
	}

	items := res.GetItems()
	results := []structs.HistoryItem{}
	for _, item := range items {
		results = append(results, structs.HistoryItem{
			Id:      item.GetId(),
			Product: item.GetProduct(),
			User:    item.GetUser(),
			Date:    item.GetDate(),
			Count:   item.GetCount(),
			Total:   item.GetTotal(),
		})
	}
	return results, nil
}

func (h HistoryModule) GetMonthHistory(data structs.DataMonth) ([]structs.HistoryItem, *structs.CoreError) {
	firstDay := time.Date(data.Year, time.Month(data.Month), 1, 0, 0, 0, 0, time.UTC)
	lastDay := firstDay.AddDate(0, 1, -1)
	lastDay = time.Date(lastDay.Year(), lastDay.Month(), lastDay.Day(), 23, 59, 59, 0, lastDay.Location())

	res, err := historyModel.GetByRange(context.Background(), &grpcs.GetByRangeArgs{
		Start: firstDay.UnixMilli(),
		End:   lastDay.UnixMilli(),
	})
	if err != nil {
		return nil, &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo obtener el historial",
			IsInternal: true,
		}
	}

	items := res.GetItems()
	results := []structs.HistoryItem{}
	for _, item := range items {
		results = append(results, structs.HistoryItem{
			Id:      item.GetId(),
			Product: item.GetProduct(),
			User:    item.GetUser(),
			Date:    item.GetDate(),
			Count:   item.GetCount(),
			Total:   item.GetTotal(),
		})
	}
	return results, nil
}
