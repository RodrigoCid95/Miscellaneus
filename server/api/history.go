package api

import (
	"Miscellaneous/core/models"
	"Miscellaneous/server/middlewares"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type HistoryAPI struct{}

func (h *HistoryAPI) GetDayHistory(c echo.Context) error {
	strYear := c.Param("year")
	year, err := strconv.Atoi(strYear)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	strMonth := c.Param("month")
	month, err := strconv.Atoi(strMonth)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	strDay := c.Param("day")
	day, err := strconv.Atoi(strDay)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	start := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	end := time.Date(year, time.Month(month), day, 23, 59, 59, 0, time.UTC)
	results := models.History.GetByRange(start.UnixMilli(), end.UnixMilli())

	return c.JSON(http.StatusOK, results)
}

func (h *HistoryAPI) GetWeekHistory(c echo.Context) error {
	strYear := c.Param("year")
	year, err := strconv.Atoi(strYear)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	strWeek := c.Param("week")
	week, err := strconv.Atoi(strWeek)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	jan4 := time.Date(year, time.January, 5, 0, 0, 0, 0, time.UTC)
	isoYear, isoWeek := jan4.ISOWeek()
	for isoYear != year || isoWeek != 1 {
		jan4 = jan4.AddDate(0, 0, -1)
		isoYear, isoWeek = jan4.ISOWeek()
	}
	offsetDays := (week - 1) * 7
	start := jan4.AddDate(0, 0, offsetDays)
	end := start.AddDate(0, 0, 6).Add(time.Hour*23 + time.Minute*59 + time.Second*59 + time.Millisecond*999)
	results := models.History.GetByRange(start.UnixMilli(), end.UnixMilli())

	return c.JSON(http.StatusOK, results)
}

func (h *HistoryAPI) GetMonthHistory(c echo.Context) error {
	strYear := c.Param("year")
	year, err := strconv.Atoi(strYear)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	strMonth := c.Param("month")
	month, err := strconv.Atoi(strMonth)
	if err != nil {
		return c.JSON(http.StatusOK, []any{})
	}

	firstDay := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	lastDay := firstDay.AddDate(0, 1, -1)
	lastDay = time.Date(lastDay.Year(), lastDay.Month(), lastDay.Day(), 23, 59, 59, 0, lastDay.Location())
	results := models.History.GetByRange(firstDay.UnixMilli(), lastDay.UnixMilli())

	return c.JSON(http.StatusOK, results)
}

func RegisterHistoryAPI(e *echo.Echo) {
	h := HistoryAPI{}

	e.GET("/api/history/day/:year/:month/:day", h.GetDayHistory, middlewares.SM.VerifySession)
	e.GET("/api/history/week/:year/:week", h.GetWeekHistory, middlewares.SM.VerifySession)
	e.GET("/api/history/month/:year/:month", h.GetMonthHistory, middlewares.SM.VerifySession)
}
