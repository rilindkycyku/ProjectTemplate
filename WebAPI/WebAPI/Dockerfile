# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src

COPY WebAPI.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app/publish --no-restore

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish ./

# Creates wwwroot dir (for static file serving)
RUN mkdir -p /app/wwwroot

EXPOSE 80
ENTRYPOINT ["dotnet", "WebAPI.dll"]
