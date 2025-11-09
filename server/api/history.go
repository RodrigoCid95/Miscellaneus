package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"
	"strconv"

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

	results, getError := modules.History.GetDayHistory(structs.DataDay{
		Day:   day,
		Month: month,
		Year:  year,
	})
	if getError != nil {
		return errors.ProcessError(getError, c)
	}

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

	results, getError := modules.History.GetWeekHistory(structs.DataWeek{
		Week: week,
		Year: year,
	})
	if getError != nil {
		return errors.ProcessError(getError, c)
	}

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

	results, getError := modules.History.GetMonthHistory(structs.DataMonth{
		Month: month,
		Year:  year,
	})
	if getError != nil {
		return errors.ProcessError(getError, c)
	}

	return c.JSON(http.StatusOK, results)
}

func RegisterHistoryAPI(e *echo.Echo) {
	h := HistoryAPI{}

	e.GET("/api/history/day/:year/:month/:day", h.GetDayHistory, middlewares.SM.VerifySession)
	e.GET("/api/history/week/:year/:week", h.GetWeekHistory, middlewares.SM.VerifySession)
	e.GET("/api/history/month/:year/:month", h.GetMonthHistory, middlewares.SM.VerifySession)
}
