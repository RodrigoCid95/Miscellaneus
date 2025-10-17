package controllers

import (
	"Miscellaneous/models"
	"time"
)

type DataDay struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Day   int `json:"day"`
}

type DataWeek struct {
	Year int `json:"year"`
	Week int `json:"week"`
}

type DataMonth struct {
	Year  int `json:"year"`
	Month int `json:"month"`
}

type History struct{}

func (h *History) GetDayHistory(data DataDay) []models.HistoryItem {
	start := time.Date(data.Year, time.Month(data.Month), data.Day, 0, 0, 0, 0, time.UTC)
	end := time.Date(data.Year, time.Month(data.Month), data.Day, 23, 59, 59, 0, time.UTC)

	return models.History.GetByRange(start.UnixMilli(), end.UnixMilli())
}

func (h *History) GetWeekHistory(data DataWeek) []models.HistoryItem {
	jan4 := time.Date(data.Year, time.January, 5, 0, 0, 0, 0, time.UTC)
	isoYear, isoWeek := jan4.ISOWeek()
	for isoYear != data.Year || isoWeek != 1 {
		jan4 = jan4.AddDate(0, 0, -1)
		isoYear, isoWeek = jan4.ISOWeek()
	}
	offsetDays := (data.Week - 1) * 7
	start := jan4.AddDate(0, 0, offsetDays)
	end := start.AddDate(0, 0, 6).Add(time.Hour*23 + time.Minute*59 + time.Second*59 + time.Millisecond*999)

	return models.History.GetByRange(start.UnixMilli(), end.UnixMilli())
}

func (h *History) GetMonthHistory(data DataMonth) []models.HistoryItem {
	firstDay := time.Date(data.Year, time.Month(data.Month), 1, 0, 0, 0, 0, time.UTC)
	lastDay := firstDay.AddDate(0, 1, -1)
	lastDay = time.Date(lastDay.Year(), lastDay.Month(), lastDay.Day(), 23, 59, 59, 0, lastDay.Location())

	return models.History.GetByRange(firstDay.UnixMilli(), lastDay.UnixMilli())
}
