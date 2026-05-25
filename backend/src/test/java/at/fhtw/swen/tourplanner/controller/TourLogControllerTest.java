package at.fhtw.swen.tourplanner.controller;

import at.fhtw.swen.tourplanner.dto.TourLogDto;
import at.fhtw.swen.tourplanner.exception.TourLogNotFoundException;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.model.DifficultyLevel;
import at.fhtw.swen.tourplanner.service.TourLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TourLogController.class)
class TourLogControllerTest {

    @Autowired private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

    @MockitoBean private TourLogService tourLogService;

    private static final UUID TOUR_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID LOG_ID  = UUID.fromString("22222222-2222-2222-2222-222222222222");

    private TourLogDto sampleDto() {
        return TourLogDto.builder()
                .id(LOG_ID).tourId(TOUR_ID)
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(4)
                .difficulty(DifficultyLevel.MEDIUM)
                .comment("Schöne Tour")
                .build();
    }

    private TourLogDto validInput() {
        return TourLogDto.builder()
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(4)
                .difficulty(DifficultyLevel.EASY)
                .build();
    }

    // ── GET /api/tours/{tourId}/logs ──────────────────────────────────────────

    @Test
    void getAll_returnsOkWithJsonArray() throws Exception {
        when(tourLogService.findAllByTour(TOUR_ID)).thenReturn(List.of(sampleDto()));

        mockMvc.perform(get("/api/tours/{tourId}/logs", TOUR_ID))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(LOG_ID.toString()))
                .andExpect(jsonPath("$[0].rating").value(4))
                .andExpect(jsonPath("$[0].difficulty").value("MEDIUM"));
    }

    @Test
    void getAll_emptyList_returnsEmptyArray() throws Exception {
        when(tourLogService.findAllByTour(TOUR_ID)).thenReturn(List.of());

        mockMvc.perform(get("/api/tours/{tourId}/logs", TOUR_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAll_tourNotFound_returns404() throws Exception {
        when(tourLogService.findAllByTour(TOUR_ID)).thenThrow(new TourNotFoundException(TOUR_ID));

        mockMvc.perform(get("/api/tours/{tourId}/logs", TOUR_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ── POST /api/tours/{tourId}/logs ─────────────────────────────────────────

    @Test
    void create_validDto_returnsCreated() throws Exception {
        when(tourLogService.create(eq(TOUR_ID), any())).thenReturn(sampleDto());

        mockMvc.perform(post("/api/tours/{tourId}/logs", TOUR_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(LOG_ID.toString()))
                .andExpect(jsonPath("$.rating").value(4));
    }

    @Test
    void create_missingDate_returns400WithFieldError() throws Exception {
        TourLogDto input = TourLogDto.builder()
                .duration(60).rating(3).difficulty(DifficultyLevel.EASY).build();

        mockMvc.perform(post("/api/tours/{tourId}/logs", TOUR_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.date").exists());
    }

    @Test
    void create_ratingAboveMax_returns400() throws Exception {
        TourLogDto input = TourLogDto.builder()
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(6).difficulty(DifficultyLevel.EASY).build();

        mockMvc.perform(post("/api/tours/{tourId}/logs", TOUR_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.rating").exists());
    }

    @Test
    void create_missingDifficulty_returns400() throws Exception {
        TourLogDto input = TourLogDto.builder()
                .date(LocalDate.of(2025, 5, 1))
                .duration(60).rating(3).build();

        mockMvc.perform(post("/api/tours/{tourId}/logs", TOUR_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.difficulty").exists());
    }

    // ── PUT /api/tours/{tourId}/logs/{logId} ──────────────────────────────────

    @Test
    void update_validDto_returnsOk() throws Exception {
        when(tourLogService.update(eq(TOUR_ID), eq(LOG_ID), any())).thenReturn(sampleDto());

        mockMvc.perform(put("/api/tours/{tourId}/logs/{logId}", TOUR_ID, LOG_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(LOG_ID.toString()));
    }

    @Test
    void update_logNotFound_returns404() throws Exception {
        when(tourLogService.update(eq(TOUR_ID), eq(LOG_ID), any()))
                .thenThrow(new TourLogNotFoundException(LOG_ID));

        mockMvc.perform(put("/api/tours/{tourId}/logs/{logId}", TOUR_ID, LOG_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ── DELETE /api/tours/{tourId}/logs/{logId} ───────────────────────────────

    @Test
    void delete_exists_returnsNoContent() throws Exception {
        doNothing().when(tourLogService).delete(TOUR_ID, LOG_ID);

        mockMvc.perform(delete("/api/tours/{tourId}/logs/{logId}", TOUR_ID, LOG_ID))
                .andExpect(status().isNoContent());

        verify(tourLogService).delete(TOUR_ID, LOG_ID);
    }

    @Test
    void delete_logNotFound_returns404() throws Exception {
        doThrow(new TourLogNotFoundException(LOG_ID))
                .when(tourLogService).delete(TOUR_ID, LOG_ID);

        mockMvc.perform(delete("/api/tours/{tourId}/logs/{logId}", TOUR_ID, LOG_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
