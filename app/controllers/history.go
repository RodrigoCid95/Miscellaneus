package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type History struct{}

func (h *History) GetDayHistory(data structs.DataDay) ([]structs.HistoryItem, error) {
	results, err := modules.History.GetDayHistory(data)
	if err != nil {
		return results, errors.ProcessError(err)
	}

	return results, nil
}

func (h *History) GetWeekHistory(data structs.DataWeek) ([]structs.HistoryItem, error) {
	results, err := modules.History.GetWeekHistory(data)
	if err != nil {
		return results, errors.ProcessError(err)
	}

	return results, nil
}

func (h *History) GetMonthHistory(data structs.DataMonth) ([]structs.HistoryItem, error) {
	results, err := modules.History.GetMonthHistory(data)
	if err != nil {
		return results, errors.ProcessError(err)
	}

	return results, nil
}
